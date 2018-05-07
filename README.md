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
# ro
npm run build
```

### Deploy Project

```bash
pm2 start ./config/process.yml
```

## API

### Upload Content

#### URL

```bash
http://localhost:3000/files/create
```

#### Method

```bash
POST
```

#### Params

```json
{
  "key": "hello_world", // string
  "content": "Hello World", // string, stream
  "force": false // boolean
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
http://localhost:3000/files/show/hello_world
```

#### Method

```bash
GET
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
http://47.97.171.140:3000/files/send
```

#### Params

```json
{
  "key": "hello_world",
  "remote": "http://localhost:3000/files/create"
}
```

#### Other

None

#### Returns

```json
{
  "error": {
    "code": -1,
    "message": "Error Message"
  }
}
```
