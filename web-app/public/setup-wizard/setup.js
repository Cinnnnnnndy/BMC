// 获取 VS Code API（使用父窗口已获取的实例）
const vscode = window.vscode || acquireVsCodeApi();

// 当前状态
let currentState = {
    step: 1,
    auth: {
        isLoggedIn: false,
        userInfo: null,
    },
    environment: {
        conanConfigured: false,
        conanExists: false,
        conanChecked: false,  // 是否已执行过检测
    },
    modelConfig: {
        configured: false,
    },
    dontShowAgain: false,
    platform: null,  // 操作系统平台: 'win32' | 'linux' | 'darwin'
};

// DOM 元素（延迟初始化，在init函数中获取）
let elements = {};

// 初始化DOM元素引用
function initElements() {
    elements = {
        // 步骤面板
        stepPanels: {
            1: document.getElementById('step-1'),
            2: document.getElementById('step-2'),
            3: document.getElementById('step-3'),
        },
        // 步骤条项
        stepItems: {
            1: document.querySelector('.sw-step-item[data-step="1"]'),
            2: document.querySelector('.sw-step-item[data-step="2"]'),
            3: document.querySelector('.sw-step-item[data-step="3"]'),
        },
        // 按钮
        btnClose: document.getElementById('btn-close'),
        btnLogin: document.getElementById('btn-login'),
        btnOpenRemote: document.getElementById('btn-open-remote'),
        btnCheckEnvironment: document.getElementById('btn-check-environment'),
        step2_1Tag: document.getElementById('step-2-1-tag'),
        step2_2Tag: document.getElementById('step-2-2-tag'),
        windowsCheckResult: document.getElementById('windows-conan-detection-results'),
        conanNotExists: document.getElementById('conan-exists-status'),
        conanNotConfig: document.getElementById('conan-remote-status'),
        conanResultBanner: document.getElementById('conan-result-banner'),

        // 环境配置检测结果
        envConfigSuccess: document.getElementById('env-config-success'),
        envConfigFail: document.getElementById('env-config-fail'),
        btnConfigRules: document.getElementById('btn-config-rules'),
        btnCancel: document.getElementById('btn-cancel'),
        btnPrevious: document.getElementById('btn-previous'),
        btnNext: document.getElementById('btn-next'),
        // 状态显示（登录）
        loginBefore: document.getElementById('login-before'),
        loginAfter: document.getElementById('login-after'),

        // 完成动画
        completionOverlay: document.getElementById('completion-overlay'),
        fireworksContainer: document.getElementById('fireworks-container'),
        confettiContainer: document.getElementById('confetti-container'),
        // 向导弹框
        wizardContainer: document.querySelector('.sw-wizard-container'),
        bodyBackground: document.querySelector('body'),
        // 取消对话框
        cancelDialog: document.getElementById('cancel-dialog'),
        cancelConfirm: document.getElementById('cancel-confirm'),
        cancelDialogClose: document.getElementById('cancel-dialog-close'),
        cancelDialogCloseBtn: document.getElementById('cancel-dialog-close-btn'),
        dontShowAgain: document.getElementById('dont-show-again'),
    };
}

// 初始化
function init() {
    // 先初始化DOM元素引用（确保setup.html已注入）
    initElements();

    // 绑定事件
    bindEvents();

    // 请求初始状态
    vscode.postMessage({ type: 'init' });

    // 立即更新按钮状态（确保初始状态正确）
    updateButtons();
}

// 绑定事件
function bindEvents() {
    // 关闭按钮
    elements.btnClose?.addEventListener('click', () => {
        showCancelDialog();
    });

    // 登录按钮
    elements.btnLogin?.addEventListener('click', () => {
        vscode.postMessage({ type: 'login' });
    });

    // 打开远程连接配置
    elements.btnOpenRemote?.addEventListener('click', (e) => {
        e.preventDefault();
        vscode.postMessage({ type: 'openRemote' });
    });

    // 环境配置检测
    elements.btnCheckEnvironment?.addEventListener('click', () => {
        // 隐藏之前的结果
        if (elements.envConfigSuccess) {
            elements.envConfigSuccess.classList.add('sw-hidden');
        }
        if (elements.envConfigFail) {
            elements.envConfigFail.classList.add('sw-hidden');
        }

        // 禁用按钮
        elements.btnCheckEnvironment.disabled = true;
        elements.btnCheckEnvironment.textContent = '检测中...';

        // 发送检测请求
        vscode.postMessage({ type: 'checkEnvironment' });
    });

    // 配置规则
    elements.btnConfigRules?.addEventListener('click', () => {
        vscode.postMessage({ type: 'openModelConfig' });
    });

    // 卡片收起/展开按钮（第二步的 Step 2.1 和 Step 2.2）
    const cardCollapseBtns = document.querySelectorAll('.sw-card-collapse-btn');
    cardCollapseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cardId = btn.getAttribute('data-card');
            const contentDiv = document.getElementById(`card-content-${cardId}`);

            if (contentDiv) {
                const isCollapsed = contentDiv.classList.contains('sw-collapsed');
                // 切换状态
                updateCardState(cardId, isCollapsed);
            }
        });
    });

    // 取消按钮
    elements.btnCancel?.addEventListener('click', () => {
        showCancelDialog();
    });

    // 上一步
    elements.btnPrevious?.addEventListener('click', () => {
        if (currentState.step > 1) {
            navigateToStep(currentState.step - 1);
        }
    });

    // 下一步
    elements.btnNext?.addEventListener('click', () => {
        // 检查是否允许进入下一步
        const canProceed = checkCanProceed();
        if (!canProceed) {
            // 如果不能进入下一步，不执行任何操作
            return;
        }

        if (currentState.step < 3) {
            navigateToStep(currentState.step + 1);
        } else {
            // 最后一步，完成配置
            vscode.postMessage({ type: 'complete' });
        }
    });

    // Conan 配置横幅点击事件（一键配置）
    const conanResultBanner = document.getElementById('conan-result-banner');
    if (conanResultBanner) {
        conanResultBanner.addEventListener('click', () => {
            // 只有在告警状态（未配置）时才响应
            if (currentState.environment.conanExists && !currentState.environment.conanConfigured) {
                vscode.postMessage({ type: 'configureConan' });
            }
        });
    }

    // Conan 远端配置"此处"链接点击事件（一键配置）
    const conanConfigLink = document.getElementById('conan-config-link');
    if (conanConfigLink) {
        conanConfigLink.addEventListener('click', () => {
            // 只有在告警状态（未配置）时才响应
            if (currentState.environment.conanExists && !currentState.environment.conanConfigured) {
                vscode.postMessage({ type: 'configureConan' });
            }
        });
    }

    // 绑定取消对话框事件
    bindCancelDialogEvents();

    // 绑定图片预览模态框事件
    bindImageModalEvents();
}

// 导航到指定步骤
function navigateToStep(step) {
    currentState.step = step;

    // 通知后端步骤变化
    vscode.postMessage({
        type: 'stepChanged',
        step
    });

    // 更新步骤条
    updateStepBar();

    // 更新内容区域
    Object.keys(elements.stepPanels).forEach(key => {
        const stepNum = parseInt(key);
        const panel = elements.stepPanels[key];

        if (panel) {
            if (stepNum === step) {
                panel.classList.add('sw-active');
            } else {
                panel.classList.remove('sw-active');
            }
        }
    });

    // 更新按钮状态
    updateButtons();
}

// 更新步骤条
function updateStepBar() {
    Object.keys(elements.stepItems).forEach(key => {
        const stepNum = parseInt(key);
        const item = elements.stepItems[key];

        item.classList.remove('sw-active');

        if (currentState.step >= stepNum) {
            item.classList.add('sw-active');
        }
    });
}

// 更新按钮状态
function updateButtons() {
    // 上一步按钮：第一步时隐藏
    if (elements.btnPrevious) {
        if (currentState.step <= 1) {
            elements.btnPrevious.classList.add('sw-btn-hidden');
            elements.btnPrevious.classList.remove('sw-btn-visible');
        } else {
            elements.btnPrevious.classList.remove('sw-btn-hidden');
            elements.btnPrevious.classList.add('sw-btn-visible');
            elements.btnPrevious.disabled = false;
        }
    }

    // 下一步按钮
    if (elements.btnNext) {
        const canProceed = checkCanProceed();
        elements.btnNext.disabled = !canProceed;

        // 更新按钮文本
        if (currentState.step === 3) {
            elements.btnNext.textContent = '完成';
        } else {
            elements.btnNext.textContent = '下一步';
        }
    }
}

// 检查是否可以进入下一步
function checkCanProceed() {
    switch (currentState.step) {
        case 1:
            // 第一步：需要登录
            return currentState.auth.isLoggedIn;
        case 2:
            // 第二步：需要 Conan 配置完成
            return currentState.environment.conanConfigured;
        case 3:
            // 第三步：需要模型配置完成
            return currentState.modelConfig.configured;
        default:
            return false;
    }
}

// 处理来自扩展的消息
// 使用消息处理器映射表，提高可维护性和性能
const MESSAGE_HANDLERS = {
    updateState: (message) => {
        const previousStep = currentState.step;

        // 深度合并状态，确保不会意外覆盖嵌套对象
        if (message.state.auth) {
            currentState.auth = { ...currentState.auth, ...message.state.auth };
        }
        if (message.state.environment) {
            currentState.environment = { ...currentState.environment, ...message.state.environment };
        }
        if (message.state.modelConfig) {
            currentState.modelConfig = { ...currentState.modelConfig, ...message.state.modelConfig };
        }
        if (message.state.step !== undefined) {
            currentState.step = message.state.step;
        }
        if (message.state.dontShowAgain !== undefined) {
            currentState.dontShowAgain = message.state.dontShowAgain;
        }
        if (message.state.platform !== undefined) {
            currentState.platform = message.state.platform;
        }

        // 如果步骤发生了变化，导航到新步骤
        if (message.state.step !== undefined && message.state.step !== previousStep) {
            navigateToStep(message.state.step);
        }

        // 如果环境状态发生了变化，更新横幅显示
        if (message.state.environment) {
            const env = message.state.environment;
            // 如果已经检测过（conanChecked 为 true），根据检测结果显示横幅
            if (env.conanChecked) {
                if (elements.envConfigSuccess) {
                    elements.envConfigSuccess.classList.toggle('sw-hidden', !env.conanConfigured);
                }
                if (elements.envConfigFail) {
                    elements.envConfigFail.classList.toggle('sw-hidden', env.conanConfigured);
                }
            } else {
                // 如果还没有检测过（conanChecked 为 false），隐藏所有横幅
                if (elements.envConfigSuccess) {
                    elements.envConfigSuccess.classList.add('sw-hidden');
                }
                if (elements.envConfigFail) {
                    elements.envConfigFail.classList.add('sw-hidden');
                }
            }
        }

        updateUI();
    },

    loginSuccess: (message) => {
        currentState.auth.isLoggedIn = true;
        currentState.auth.userInfo = message.userInfo;
        updateLoginUI();
        updateButtons();
    },

    logout: () => {
        currentState.auth.isLoggedIn = false;
        currentState.auth.userInfo = null;
        updateLoginUI();
        updateButtons();
    },

    loginError: (message) => {
        vscode.postMessage({ type: 'log', level: 'error', message: 'loginError: ' + (message.error || '') });
        showError(message.error || '登录失败');
    },

    conanChecked: (message) => {
        currentState.environment.conanExists = message.exists;
        currentState.environment.conanConfigured = message.configured;
        currentState.environment.conanChecked = true;
        currentState.environment.isChecking = false;

        // 恢复环境检测按钮状态
        if (elements.btnCheckEnvironment) {
            elements.btnCheckEnvironment.disabled = false;
            elements.btnCheckEnvironment.textContent = '配置检测';
        }

        updateConanUI();
        updateButtons();
    },

    modelConfigured: (message) => {
        currentState.modelConfig.configured = true;
        updateModelConfigUI();
        updateButtons();
    },

    configChecked: (message) => {
        currentState.modelConfig.configured = message.configured;
        updateModelConfigUI();
        updateButtons();
    },

    modelConfigStatusChanged: (message) => {
        currentState.modelConfig.configured = message.config.isConfigured;
        updateModelConfigUI();
        updateButtons();
    },

    complete: () => {
        showCompletionAnimation();
    },

    navigate: (message) => {
        navigateToStep(message.step);
    },

    goToStep: (message) => {
        navigateToStep(message.step);
    },

    showWizard: () => {
        showWizard();
    },

    hideWizard: () => {
        hideWizard();
    },
};

// 监听来自扩展的消息
window.addEventListener('message', (event) => {
    const message = event.data;
    const messageType = message?.type;

    if (!messageType) {
        vscode.postMessage({ type: 'log', level: 'warn', message: 'Received message without type: ' + JSON.stringify(message) });
        return;
    }

    // 查找并执行对应的处理器
    const handler = MESSAGE_HANDLERS[messageType];

    if (handler) {
        try {
            handler(message);
        } catch (error) {
            vscode.postMessage({ type: 'log', level: 'error', message: "Error handling message '" + messageType + "': " + error });
            // 显示错误提示给用户
            showError(`处理消息时出错: ${messageType}`);
        }
    } else {
        vscode.postMessage({ type: 'log', level: 'warn', message: 'Unknown message type: ' + messageType });
    }
});

// 更新 UI
function updateUI() {
    updateLoginUI();
    updateConanUI();
    updateModelConfigUI();
    updateStepBar();
    updateButtons();
    updatePlatformBasedUI();
}

// 更新登录 UI
function updateLoginUI() {
    if (currentState.auth.isLoggedIn) {
        elements.loginBefore?.classList.add('sw-hidden');
        elements.loginAfter?.classList.remove('sw-hidden');
    } else {
        elements.loginBefore?.classList.remove('sw-hidden');
        elements.loginAfter?.classList.add('sw-hidden');
    }
}

// 根据平台显示不同的结果
function conanResultWindows() {
    
}

// 更新 Conan UI
function updateConanUI() {
    elements.envConfigSuccess.classList.add('sw-hidden');
    elements.envConfigFail.classList.add('sw-hidden');

    elements.windowsCheckResult.classList.add('sw-hidden');
    elements.conanNotExists.classList.add('sw-hidden');
    elements.conanNotConfig.classList.add('sw-hidden');
    elements.conanResultBanner.classList.add('sw-hidden');
    // 如果还没检测过，不显示检测结果区域
    if (!currentState.environment.conanChecked) {
        return;
    }
    elements.step2_2Tag.classList.remove('tag-un-done');
    elements.step2_2Tag.classList.remove('tag-done');
    if (currentState.platform === 'win32') {
        elements.windowsCheckResult.classList.remove('sw-hidden');
        elements.step2_2Tag.textContent = '未完成';
        if (!currentState.environment.conanExists) {
            elements.conanNotExists.classList.remove('sw-hidden');
            elements.step2_2Tag.classList.add('tag-un-done');
        } else if (!currentState.environment.conanConfigured) {
            elements.step2_2Tag.classList.add('tag-un-done');
            elements.conanNotConfig.classList.remove('sw-hidden');
        } else {
            elements.step2_2Tag.textContent = '已完成';
            elements.step2_2Tag.classList.add('tag-done');
            elements.conanResultBanner.classList.remove('sw-hidden');
        }
    } else {
        // Linux: 使用 env-config-success / env-config-fail
        if (currentState.environment.conanConfigured) {
            elements.envConfigSuccess.classList.remove('sw-hidden');
            elements.step2_2Tag.textContent = '已完成';
            elements.step2_2Tag.classList.add('tag-done');
        } else {
            elements.envConfigFail.classList.remove('sw-hidden');
            elements.step2_2Tag.textContent = '未完成';
            elements.step2_2Tag.classList.add('tag-un-done');
        }
    }
}

// 更新模型配置 UI
function updateModelConfigUI() {
    // 动态查询模型配置卡片元素
    const modelConfigCard = document.getElementById('model-config-card');
    const modelConfigTitle = document.getElementById('model-config-title');

    if (!modelConfigCard || !modelConfigTitle) {
        vscode.postMessage({ type: 'log', level: 'warn', message: 'Model config elements not found' });
        return;
    }

    if (currentState.modelConfig.configured) {
        // 已配置：绿色对勾 + "机型数据配置完成"
        modelConfigCard.classList.remove('sw-model-config-warning');
        modelConfigCard.classList.add('sw-model-config-success');
        if (modelConfigTitle) {
            modelConfigTitle.textContent = '机型数据配置完成';
        }
    } else {
        // 未配置：橙色感叹号 + "机型数据暂未配置"
        modelConfigCard.classList.remove('sw-model-config-success');
        modelConfigCard.classList.add('sw-model-config-warning');
        if (modelConfigTitle) {
            modelConfigTitle.textContent = '机型数据暂未配置';
        }
    }
}

// 更新卡片状态（展开/收起）和对应的图标
function updateCardState(cardId, isExpanded) {
    const contentDiv = document.getElementById(`card-content-${cardId}`);
    const btn = document.querySelector(`.sw-card-collapse-btn[data-card="${cardId}"]`);

    if (!contentDiv || !btn) {
        return;
    }

    const collapseIcon = btn.querySelector('.sw-collapse-icon');
    const expandIcon = btn.querySelector('.sw-expand-icon');

    if (isExpanded) {
        contentDiv.classList.add('sw-expanded');
        contentDiv.classList.remove('sw-collapsed');
        if (collapseIcon) collapseIcon.classList.remove('sw-hidden');
        if (expandIcon) expandIcon.classList.add('sw-hidden');
    } else {
        contentDiv.classList.remove('sw-expanded');
        contentDiv.classList.add('sw-collapsed');
        if (collapseIcon) collapseIcon.classList.add('sw-hidden');
        if (expandIcon) expandIcon.classList.remove('sw-hidden');
    }
}

// 根据平台更新UI（展开/收起对应的卡片）
function updatePlatformBasedUI() {
    if (!currentState.platform) {
        return; // 平台信息未知，不处理
    }

    const step2_1 = document.getElementById('card-content-step-2-1');
    const step2_2 = document.getElementById('card-content-step-2-2');

    if (!step2_1 || !step2_2) {
        return;
    }

    // Windows环境：展开2.1，收起2.2
    if (currentState.platform === 'win32') {
        updateCardState('step-2-1', true);
        updateCardState('step-2-2', false);
    }
    // Linux环境：收起2.1，展开2.2
    else if (currentState.platform === 'linux' || currentState.platform === 'darwin') {
        updateCardState('step-2-1', false);
        updateCardState('step-2-2', true);
    }

    elements.step2_1Tag.classList.remove('tag-un-done');
    elements.step2_1Tag.classList.remove('tag-done');
    elements.step2_2Tag.textContent = '未完成';
    elements.step2_2Tag.classList.add('tag-un-done');
    if (currentState.platform === 'win32') {
        elements.step2_1Tag.textContent = '未完成';
        elements.step2_1Tag.classList.add('tag-un-done');
    } else {
        elements.step2_1Tag.textContent = '已完成';
        elements.step2_1Tag.classList.add('tag-done');
    }
}

// 显示错误
function showError(message) {
    vscode.postMessage({
        type: 'showError',
        message
    });
}

// 显示完成动画
function showCompletionAnimation() {
    const overlay = elements.completionOverlay;
    if (!overlay) return;

    // 使用 requestAnimationFrame 确保动画流畅
    requestAnimationFrame(() => {
        // 先显示 overlay（带淡入效果）
        overlay.classList.remove('sw-hidden');
        overlay.style.animation = 'fadeIn 0.3s ease-out';

        // 下一帧再创建动画，避免卡顿
        requestAnimationFrame(() => {
            // 创建烟花效果
            createFireworks();

            // 创建彩带效果
            createConfetti();
        });
    });

    // 3 秒后隐藏弹框
    setTimeout(() => {
        hideWizard();
        overlay.classList.add('sw-hidden');
        overlay.style.animation = '';
        // 清理动画元素
        clearAnimations();
    }, 3000);
}

// 创建烟花效果
function createFireworks() {
    const container = elements.fireworksContainer;
    if (!container) return;

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894'];

    // 创建多个烟花爆炸点
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const x = Math.random() * 100;
            const y = Math.random() * 60 + 20;

            // 每个爆炸点创建多个粒子
            for (let j = 0; j < 16; j++) {
                const firework = document.createElement('div');
                firework.className = 'sw-firework';
                firework.style.left = x + '%';
                firework.style.top = y + '%';
                firework.style.background = colors[Math.floor(Math.random() * colors.length)];

                const angle = (Math.PI * 2 * j) / 16;
                const distance = 80 + Math.random() * 80;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                firework.style.setProperty('--tx', tx + 'px');
                firework.style.setProperty('--ty', ty + 'px');

                container.appendChild(firework);

                // 动画结束后移除
                setTimeout(() => firework.remove(), 1500);
            }
        }, i * 150);
    }
}

// 创建彩带效果
function createConfetti() {
    const container = elements.fireworksContainer;
    if (!container) return;

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894', '#e17055', '#00cec9'];

    // 使用 DocumentFragment 批量添加 DOM，提高性能
    const fragment = document.createDocumentFragment();
    const totalConfetti = 80; // 减少数量，提高性能

    for (let i = 0; i < totalConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'sw-confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);

        // 随机旋转和大小
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.width = (5 + Math.random() * 10) + 'px';
        confetti.style.height = (5 + Math.random() * 10) + 'px';

        // 使用 CSS 变量设置动画延迟，让每个彩带在不同时间下落
        confetti.style.animationDelay = (Math.random() * 2) + 's';

        fragment.appendChild(confetti);

        // 动画结束后移除
        setTimeout(() => confetti.remove(), 5000);
    }

    // 一次性添加所有彩带
    container.appendChild(fragment);
}

// 清理动画元素
function clearAnimations() {
    const fireworksContainer = elements.fireworksContainer;
    if (fireworksContainer) {
        fireworksContainer.innerHTML = '';
    }

    const confettiContainer = elements.confettiContainer;
    if (confettiContainer) {
        confettiContainer.innerHTML = '';
    }
}

// 显示向导弹框
function showWizard() {
    // 动态查询wizard-container（因为内容是后注入的）
    const wizardContainer = document.querySelector('.sw-wizard-container');

    if (wizardContainer) {
        wizardContainer.classList.remove('sw-hidden');
    }

    if (elements.bodyBackground) {
        elements.bodyBackground.classList.remove('sw-wizard-hidden');
    }

    // 禁用欢迎页body滚动
    document.body.classList.add('sw-no-scroll');
}

// 隐藏向导弹框
function hideWizard() {
    // 动态查询wizard-container（因为内容是后注入的）
    const wizardContainer = document.querySelector('.sw-wizard-container');

    if (wizardContainer) {
        wizardContainer.classList.add('sw-hidden');
    }

    if (elements.bodyBackground) {
        elements.bodyBackground.classList.add('sw-wizard-hidden');
    }

    // 恢复欢迎页body滚动
    document.body.classList.remove('sw-no-scroll');
}

// 显示取消对话框
function showCancelDialog() {
    // 如果已勾选"不再提示"，直接执行跳过
    if (currentState.dontShowAgain) {
        vscode.postMessage({
            type: 'skip',
            dontShowAgain: true
        });
        hideWizard();
        return;
    }

    elements.cancelDialog?.classList.remove('sw-hidden');
}

// 隐藏取消对话框
function hideCancelDialog() {
    elements.cancelDialog?.classList.add('sw-hidden');
    elements.dontShowAgain && (elements.dontShowAgain.checked = false);
}

// 确认取消
function confirmCancel() {
    const dontShowAgain = elements.dontShowAgain?.checked || false;

    vscode.postMessage({
        type: 'skip',
        dontShowAgain
    });

    hideCancelDialog();
    hideWizard();
}

// 绑定取消对话框事件
function bindCancelDialogEvents() {
    elements.cancelDialogClose?.addEventListener('click', hideCancelDialog);
    elements.cancelDialogCloseBtn?.addEventListener('click', hideCancelDialog);
    elements.cancelConfirm?.addEventListener('click', confirmCancel);

    // 点击背景关闭
    elements.cancelDialog?.addEventListener('click', (e) => {
        if (e.target === elements.cancelDialog) {
            hideCancelDialog();
        }
    });
}

// 绑定图片预览模态框事件
function bindImageModalEvents() {
    const imageModal = document.getElementById('image-modal');
    const imageModalClose = document.getElementById('image-modal-close');
    const imageModalContent = document.getElementById('image-modal-content');

    // 所有可预览的图片
    const previewableImages = document.querySelectorAll('.sw-model-preview-image, .sw-remote-demo-image');

    // 为每个预览图片添加点击事件
    previewableImages.forEach(img => {
        img.addEventListener('click', () => {
            if (imageModal && imageModalContent) {
                imageModalContent.src = img.src;
                imageModal.classList.remove('sw-hidden');
                imageModal.classList.add('sw-visible');
            }
        });
    });

    // 点击关闭按钮关闭模态框
    imageModalClose?.addEventListener('click', () => {
        if (imageModal) {
            imageModal.classList.remove('sw-visible');
            imageModal.classList.add('sw-hidden');
        }
    });

    // 点击背景关闭模态框
    imageModal?.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('sw-visible');
            imageModal.classList.add('sw-hidden');
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal?.classList.contains('sw-visible')) {
            imageModal.classList.remove('sw-visible');
            imageModal.classList.add('sw-hidden');
        }
    });
}

// 页面加载时初始化
init();
