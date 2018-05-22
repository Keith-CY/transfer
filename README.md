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
  "forceFlag": 0 // integer, optional, 0 = false, 1 = true
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
  "remote": "http://localhost:3000/files/create" // string, required
}
```

#### Other

None

#### Returns

Same as `Create Method`
