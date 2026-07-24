export type SignMethod = 'self_sign' | 'server_sign' | 'signserver';

export interface SignProfile {
  id: string;
  name: string;
  method: SignMethod;
  rootcaDer?: string;
  rootcaCrl?: string;
  signerPem?: string;
  tsSignerPem?: string;
  tsSignerCnf?: string;
  serverUrl?: string;
  username?: string;
  signserverUrl?: string;
  certProfileId?: string;
  workerName?: string;
}

export const METHOD_LABEL: Record<SignMethod, string> = {
  self_sign: '本地自签', server_sign: '服务器签名', signserver: 'SignServer',
};

export const METHOD_DESC: Record<SignMethod, string> = {
  self_sign: '本地自签，使用自有 PEM 密钥和 CA 证书',
  server_sign: '远程签名服务器，通过 HTTPS 接口签名',
  signserver: 'Keyfactor SignServer，基于 EJBCA 企业签名平台',
};

export const METHOD_HUE: Record<SignMethod, string> = {
  self_sign: '#4369ef', server_sign: '#04d793', signserver: '#ffaa3b',
};

export const DEMO_PROFILES: SignProfile[] = [
  {
    id: '1', name: '本地签名1', method: 'self_sign',
    rootcaDer:   '/root/workspace/signConfigTest/certs/rootca.der',
    rootcaCrl:   '/root/workspace/signConfigTest/certs/rootca.crl',
    signerPem:   '/root/workspace/signConfigTest/certs/signer.pem.enc',
    tsSignerPem: '/root/workspace/signConfigTest/certs/ts_signer.pem.enc',
    tsSignerCnf: '/root/workspace/signConfigTest/certs/tsa.cnf',
  },
  {
    id: '2', name: 'SignServer Mock', method: 'signserver',
    signserverUrl: 'https://signserver.example.com:8443',
    certProfileId: 'HpmSignProfile',
    workerName:    'PlainSigner',
  },
  {
    id: '3', name: '简易服务器签名', method: 'server_sign',
    serverUrl: 'https://sign.internal:9000',
    username:  'hpm_sign',
  },
];

export function profilePreview(p: SignProfile): string {
  if (p.method === 'self_sign')   return p.rootcaDer ?? '未配置根证书路径';
  if (p.method === 'signserver')  return p.signserverUrl ?? '未配置服务器地址';
  return p.serverUrl ?? '未配置服务器地址';
}
