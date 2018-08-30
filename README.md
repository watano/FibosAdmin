# FibosAdmin
目前Fibos暂时只能使用编程方式访问和管理fibos帐号, 这对应普通用户来说非常难以操作. 所以我简单实现了一套基于VueJs+localStorage的web前端操作界面, 此界面完全基于前端浏览器,只调用fibos主链API, 不提交敏感数据到第三方服务器.

注意:
* 本项目**只用了几个小时快速实现的**, 代码和界面细节都未优化, 暂时不具备参考价值,请忽略. 后期将持续重构优化, **尤其是界面交互**
* 本项目纯粹就是方便大家使用, **未植入任何恶意代码**, 请各位程序员帮忙**审计代码**, 或者在github上提交issues. **不放心的用户请自行寻找其他方案.**
* 本项目不需要依赖fibos开发环境, 就是一个纯粹的前端工程, 所以只需安装nodejs及其相关依赖类库即可. 代码应该支持跨平台使用.

# 本地测试环境使用
1. 安装nodejs
2. clone代码到本地目录
```bash
git clone
```
3. 安装相关依赖类库
使用npm安装:
```bash
npm install
```
使用yarn安装:
```bash
yarn
```
4. 运行本地开发环境
使用npm运行:
```bash
npm run dev
```
使用yarn运行:
```bash
yarn dev
```
5. 浏览器中打开[http://localhost:8103/fibosadmin/](http://localhost:8103/fibosadmin/)

# 远程web环境部署
1. 编译
使用npm编译:
```bash
npm run build
```
使用yarn编译:
```bash
yarn build
```
2. 部署到任意web服务器

复制dist目录下文件到web服务器下

# FO兑换基本流程
1. 注册并添加fibos帐号及其公/私钥
2. [可选] 绑定EOS帐号及私钥(EOS转帐时需要,如果使用钱包手动转帐则不需要绑定), 转帐EOS到fibos兑换帐号`fiboscouncil`
3. 兑换EOS合约帐号中的EOS->FO

# TODO
* [BUG]注册API调用跨域问题
* 现在的界面完全没有用户体验, 重新设计界面交互
* 导入导出配置信息
* 切换localStorage为IndexedDB存储
* 使用一个主密码加密所有敏感数据, 主密码保存到sessionStorage
* 资源管理: 资源显示, 质押/释放资源, 交易RAM
* 智能合约: 部署合约, 合约测试
* 节点投票


