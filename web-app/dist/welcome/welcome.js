(function() {
  'use strict';

  // 获取 VSCode API
  const vscode = acquireVsCodeApi();

  // 状态样式映射
  const statusStyles = {
    'unreleased': {
      color: '#666666',
      opacity: '0.6'
    },
    'released': {
      color: '#CCCCCC',
      opacity: '1'
    },
    'new': {
      color: '#FFFFFF',
      opacity: '1',
      fontWeight: '600'
    },
    'disabled': {
      color: '#666666',
      opacity: '0.5'
    }
  };
  // 暴露到全局，供其他脚本使用
  window.vscode = vscode;

  // 初始化
  function init() {
    // 初始化角色功能
    initRole();

    // 绑定按钮事件
    document.getElementById('openProject')?.addEventListener('click', () => {
      vscode.postMessage({ command: 'openFile' });
    });

    document.getElementById('newProject')?.addEventListener('click', () => {
      vscode.postMessage({ command: 'newFile' });
    });

    // 一键更新按钮
    document.getElementById('updateBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      vscode.postMessage({ command: 'update' });
    });

    // 关闭按钮 - 隐藏消息栏
    document.getElementById('closeBtn')?.addEventListener('click', () => {
      const messageBar = document.querySelector('.message-bar');
      if (messageBar) {
        messageBar.style.display = 'none';
      }
    });

    // 文档项点击事件
    const docItems = document.querySelectorAll('.doc-item');
    docItems.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        if (action === 'showFeatureDialog') {
          vscode.postMessage({ command: 'showFeatureDialog' });
          return;
        }
        // 特殊处理：初始配置引导
        if (item.id === 'setupWizardTrigger') {
          vscode.postMessage({ command: 'showSetupWizard' });
          return;
        }

        // 其他文档项：打开链接
        const url = item.getAttribute('data-url');
        if (url) {
          vscode.postMessage({ command: 'openLink', url: url });
        }
      });
    });

    // 初始显示空状态
    showEmptyRecentList();

    // 监听容器宽度变化
    observeContainerWidth();

    // 初始化新功能浮窗模块
    FeatureDialog.init(vscode);

    // 通知扩展端 webview 已准备好接收数据
    vscode.postMessage({ command: 'webviewReady' });
  }

  // 监听容器宽度变化
  function observeContainerWidth() {
    const container = document.querySelector('.welcome-container');
    if (!container) return;

    // 更新容器尺寸类
    const updateSizeClass = () => {
      const width = container.offsetWidth;

      // 移除所有尺寸类
      container.classList.remove('size-compact', 'size-medium', 'size-min', 'size-min-grid');

      // 根据宽度添加对应的类
      // 宽度 < 770px 时应用中等尺寸样式（按钮变小、红点、省略）
      if (width < 770) {
        container.classList.add('size-medium');
      }

      // 宽度 < 450px 时应用紧凑尺寸样式（footer垂直排列）和最小尺寸样式
      if (width < 450) {
        container.classList.add('size-compact');
        container.classList.add('size-min');
      }

      // 宽度 <= 386px 时调整网格布局为3列
      if (width <= 386) {
        container.classList.add('size-min-grid');
      }
    };

    // 初始检查
    updateSizeClass();

    // 使用 ResizeObserver 监听尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      updateSizeClass();
    });

    resizeObserver.observe(container);
  }

  // 渲染工作流程
  function renderWorkflow(workflowData) {
    const workflowContainer = document.getElementById('workflowItems');
    if (!workflowContainer || !workflowData.steps) return;

    workflowContainer.innerHTML = '';

    workflowData.steps.forEach((step, index) => {
      const stepItem = document.createElement('div');
      stepItem.className = 'workflow-item';
      stepItem.setAttribute('data-step', step.id);

      // 步骤名称
      const stepName = document.createElement('span');
      stepName.textContent = step.name;
      stepItem.appendChild(stepName);

      // 彩条 - 使用配置的颜色
      const colorBar = document.createElement('div');
      colorBar.className = 'color-bar';
      colorBar.style.background = step.color;
      colorBar.style.height = '15px';
      colorBar.style.border = '4px solid';
      colorBar.style.backgroundClip = 'padding-box'
      // 计算颜色的20%透明度版本作为边框颜色
      const hexColor = step.color.replace('#', '');
      const r = parseInt(hexColor.substr(0, 2), 16);
      const g = parseInt(hexColor.substr(2, 2), 16);
      const b = parseInt(hexColor.substr(4, 2), 16);
      colorBar.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
      colorBar.style.borderRadius = '100px';
      stepItem.appendChild(colorBar);

      // 细节列表
      const detailsContainer = document.createElement('div');
      detailsContainer.className = 'workflow-item-details';

      step.details.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'workflow-detail-item';
        detailItem.setAttribute('data-status', detail.status);
        detailItem.setAttribute('data-id', detail.id);

        if (detail.action) {
          detailItem.setAttribute('data-action', detail.action);
        }

        if (detail.status === 'disabled') {
          detailItem.classList.add('workflow-detail-disabled');
        }

        const detailSpan = document.createElement('span');
        detailSpan.textContent = detail.name;

        // 根据状态应用样式
        const style = statusStyles[detail.status] || statusStyles['released'];
        detailSpan.style.color = style.color;
        detailSpan.style.opacity = style.opacity;

        detailItem.appendChild(detailSpan);

        if (detail.action && detail.status !== 'disabled') {
          detailItem.addEventListener('click', () => {
            vscode.postMessage({ command: 'workflowAction', action: detail.action });
          });
        }

        detailsContainer.appendChild(detailItem);
      });

      stepItem.appendChild(detailsContainer);

      workflowContainer.appendChild(stepItem);
    });
  }

  // 显示空状态
  function showEmptyRecentList() {
    const recentList = document.getElementById('recentList');
    if (recentList) {
      recentList.innerHTML = `
        <li class="recent-item" data-path="">
          <div class="recent-item-icon">
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" stroke="currentColor">
              <path d="M2 7h10M7 2v10"/>
            </svg>
          </div>
          <div class="recent-item-content">
            <div class="recent-item-name">暂无最近打开的项目</div>
          </div>
        </li>
      `;
    }
  }

  // 监听来自扩展的消息
  window.addEventListener('message', (event) => {
    const message = event.data;

    // 处理角色相关消息（type 字段）
    if (message.type === 'updateRole') {
      currentRoleValue = message.role || null;
      updateRoleDisplay(message.roleName);
      return;
    }

    if (message.type === 'roleSelected') {
      currentRoleValue = message.role || null;
      updateRoleDisplay(message.roleName);
      return;
    }

    switch (message.command) {
      case 'updateRecent':
        updateRecentList(message.recent);
        break;
      case 'updateWorkflow':
        renderWorkflow(message.workflow);
        break;
      case 'showMessage':
        showMessage(message.text, message.type);
        break;
      case 'showFeatureDialog':
        FeatureDialog.show(message.config);
        break;
    }
  });

  // 更新最近打开列表
  function updateRecentList(recent) {
    const recentList = document.getElementById('recentList');
    if (!recentList) return;

    recentList.innerHTML = '';

    if (!recent || recent.length === 0) {
      showEmptyRecentList();
      return;
    }

    // 只显示最新的3个项目
    const recentToShow = recent.slice(0, 3);

    recentToShow.forEach((file, index) => {
      const li = document.createElement('li');
      li.className = 'recent-item';
      li.setAttribute('data-path', file.path);

      // 获取字母图标的基础 URI
      const uriStorage = document.getElementById('uri-storage');
      const alphabetBaseUri = uriStorage?.getAttribute('data-alphabet-base-uri');

      // 获取路径最后一个文件夹的首字母
      const pathParts = file.path.replace(/\\/g, '/').split('/');
      // 判断最后一个元素是否是文件：检查是否包含常见文件扩展名
      const lastElement = pathParts[pathParts.length - 1] || '';
      const fileExtensions = ['.code-workspace', 'json', 'xml', 'txt', 'md'];
      const isFile = fileExtensions.some(ext => lastElement.toLowerCase().endsWith(ext));
      const folderIndex = isFile ? pathParts.length - 2 : pathParts.length - 1;
      const lastFolderName = pathParts[folderIndex] || '';
      const firstChar = lastFolderName.charAt(0).toUpperCase();
      let letterFileName;
      if (/^[A-Z]$/.test(firstChar)) {
        letterFileName = `${firstChar}.png`;
      } else if (/^[0-9]$/.test(firstChar)) {
        letterFileName = `${firstChar}.png`;
      } else {
        letterFileName = 'other.png';
      }
      const letterIcon = alphabetBaseUri ? `${alphabetBaseUri}/${letterFileName}` : `./alphabet/${letterFileName}`;

      li.innerHTML = `
        <div class="recent-item-icon">
          <img src="${letterIcon}" alt="文件图标">
        </div>
        <div class="recent-item-content">
          <div class="recent-item-name">${file.name}</div>
          <div class="recent-item-path">${file.path}</div>
        </div>
      `;
      li.addEventListener('click', () => {
        vscode.postMessage({ command: 'openPath', path: file.path });
      });
      recentList.appendChild(li);
    });
  }

  // 显示消息
  function showMessage(text, type = 'info') {
    const messageBar = document.querySelector('.message-bar-left span');
    if (messageBar) {
      messageBar.textContent = text;
      if (type === 'error') {
        messageBar.style.color = 'var(--vscode-errorForeground)';
      } else if (type === 'success') {
        messageBar.style.color = 'var(--vscode-terminal-ansiGreen)';
      } else {
        messageBar.style.color = 'var(--vscode-descriptionForeground)';
      }
    }
  }

  let currentRoleValue = null;

  /**
   * 初始化角色功能
   */
  function initRole() {
    vscode.postMessage({ type: 'log', level: 'debug', message: 'Initializing role...' });

    // 请求获取当前角色
    vscode.postMessage({
      type: 'getRole'
    });

    // 绑定下拉菜单交互
    const dropdown = document.getElementById('role-dropdown');
    const switchBtn = document.getElementById('role-switch-btn');

    if (switchBtn && dropdown) {
      switchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });
    }

    // 绑定下拉选项点击
    const menu = document.getElementById('role-dropdown-menu');
    if (menu) {
      menu.addEventListener('click', (e) => {
        const item = e.target.closest('.role-dropdown-item');
        if (!item) return;
        const role = item.getAttribute('data-role');
        if (role) {
          selectRole(role);
        }
        dropdown.classList.remove('open');
      });
    }

    // 点击外部关闭下拉菜单
    document.addEventListener('click', () => {
      if (dropdown) {
        dropdown.classList.remove('open');
      }
    });
  }

  /**
   * 选择角色
   */
  function selectRole(role) {
    if (role === currentRoleValue) return;
    vscode.postMessage({ type: 'log', level: 'debug', message: 'Selecting role: ' + role });
    vscode.postMessage({
      type: 'selectRole',
      role: role
    });
  }

  /**
   * 更新角色显示
   */
  function updateRoleDisplay(roleName) {
    vscode.postMessage({ type: 'log', level: 'debug', message: 'Updating role display: ' + roleName });

    const roleValue = document.getElementById('current-role');
    const roleBadge = document.getElementById('role-switch-btn');

    if (roleValue) {
      roleValue.textContent = roleName || '--';
    }
    if (roleBadge) {
      roleBadge.style.display = roleName ? 'flex' : 'none';
    }

    // 更新下拉菜单选中状态
    const items = document.querySelectorAll('.role-dropdown-item');
    items.forEach(item => {
      item.classList.toggle('active', item.textContent === roleName);
    });
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
