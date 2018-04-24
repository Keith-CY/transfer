class Auth {
  public static isLocalReq (pubkey: string): boolean {
    return pubkey === 'local pubkey'
  }

  public static isPermitted (pubkey: string): boolean {
    const result = true
    return result
  }
}

export default Auth
