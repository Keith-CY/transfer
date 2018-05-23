# Transfer Module

## Build Project

### Requirements

1.  Node >= 8.11.1(LTS)
2.  PM2 installed globally

### Install Dependency

```bash
yarn install
# or
npm install
```

### Add Env Config

```bash
cp ./config/.env.example ./config/.env.prod
```

### Compile Typescript

```bash
yarn run build
# or
npm run build
```

### Deploy Project

```bash
pm2 start ./config/process.yml
```

## APIs

### Content Manage

### Upload Content

#### URL

```bash
[POST] http://localhost:3000/files/create
```

#### Params

```json
{
  "key": "hello_world", // string, required
  "content": "Hello World", // string, stream, required
  "forceFlag": false // boolean, optional
}
```

#### Other

```json
{
  "headers": {
    "Content-Type": "multipart/form-data"
  }
}
```

#### Returns

```json
{
  "data": true,
  "message": "Success Message"
}
{
  "error": {
    "code": -1,
    "message": "Error Message"
  }
}
```

### Get Content

#### URL

```bash
[GET] http://localhost:3000/files/show/hello_world
```

#### Params

None

#### Other

None

#### Returns

Return Content or error

```json
{
  "error": {
    "code": -1,
    "message": "File Not Found"
  }
}
```

### Send File To Remote

#### URL

```bash
[GET] http://47.97.171.140:3000/files/send
```

#### Params

```json
{
  "key": "hello_world", // string, required
  "orgId": "orgId" // string, required
}
```

#### Other

None

#### Returns

Same as `Create Method`

### Orgs Management

### Add Org

#### URL

```bash
[POST] http://47.97.171.140:3000/orgs/create
```

#### Params

```json
{
  "orgId": "orgId", // orgId
  "addr": "http://127.0.0.1/files/create:3000" // remote address
}
```

#### Other

None

#### Returns

```json
{
  "data": true
}
// or
{
  "error": {
    "code": -1,
    "message": "error message"
  }
}
```

### Update Org

#### URL

```bash
[POST] http://47.97.171.140:3000/orgs/update
```

#### Params

```json
{
  "orgId": "orgId", // orgId
  "addr": "http://127.0.0.1/files/create:3000" // remote address
}
```

#### Other

None

#### Returns

```json
{
  "data": true
}
// or
{
  "error": {
    "code": -1,
    "message": "error message"
  }
}
```

### Delete Org

#### URL

```bash
[POST] http://47.97.171.140:3000/orgs/delete
```

#### Params

```json
{
  "orgId": "orgId" // orgId
}
```

#### Other

None

#### Returns

```json
{
  "data": true
}
// or
{
  "error": {
    "code": -1,
    "message": "error message"
  }
}
```

### Get Org

#### URL

```bash
[GET] http://47.97.171.140:3000/orgs/show/:orgId
```

#### Params

None

#### Other

None

#### Returns

```json
{
  "data": "remote addr"
}
// or
{
  "error": {
    "code": -1,
    "message": "error message"
  }
}
```

### List Org

#### URL

```bash
[GET] http://47.97.171.140:3000/orgs/index
```

#### Params

None

#### Other

None

#### Returns

```json
{
  "data": [
    {
      "orgId": "orgId",
      "addr": "addr"
    }
  ]
}
// or
{
  "error": {
    "code": -1,
    "message": "error message"
  }
}
```
