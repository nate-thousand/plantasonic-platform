import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('plantasonic', {
  platform: process.platform,
});
