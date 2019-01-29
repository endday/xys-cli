## [eslint 中文网站](https://cn.eslint.org/ '跳转地址')
### 通过内嵌评论禁用规则
#### 要临时禁用文件中的规则警告，请按以下格式使用块注释：
```javascript
/* eslint-disable */

alert('foo');

/* eslint-enable */
```
#### 您还可以禁用或启用特定规则的警告：
```javascript
/* eslint-disable no-alert, no-console */

alert('foo');
console.log('bar');

/* eslint-enable no-alert, no-console */
```
#### 要在整个文件中禁用规则警告，请在文件/* eslint-disable */顶部放置块注释：
```javascript
/* eslint-disable */

alert('foo');
```
#### 您还可以禁用或启用整个文件的特定规则：
```javascript
/* eslint-disable no-alert */

alert('foo');
```
#### 要禁用特定行上的所有规则，请使用以下格式之一的行注释：
```javascript
alert('foo'); // eslint-disable-line

// eslint-disable-next-line
alert('foo');
```
#### 要禁用特定线路上的特定规则
```javascript
alert('foo'); // eslint-disable-line no-alert

// eslint-disable-next-line no-alert
alert('foo');
```
#### 要禁用特定行上的多个规则
```javascript
alert('foo'); // eslint-disable-line no-alert, quotes, semi

// eslint-disable-next-line no-alert, quotes, semi
alert('foo');
```
#### 所有上述方法也适用于插件规则。例如，要禁用eslint-plugin-example的rule-name规则，结合插件的名称（`example`）和规则的名称（`rule-name`）为`example/rule-name`：
```javascript
foo(); // eslint-disable-line example/rule-name
```
