import { storage } from '@/utils/ruoyi';

const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo || storage.get('userInfo'),
  roles: state => state.user.roles,
  auth: state => state.user.auth || storage.get('auth'),
  permissions: state => state.user.permissions.length ? state.user.permissions : storage.get('permissions'),
  permission_routes: state => state.permission.routes.length ? state.permission.routes : storage.get('routes'),
  errorLogs: state => state.errorLog.logs
}
export default getters
