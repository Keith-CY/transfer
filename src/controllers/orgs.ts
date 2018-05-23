import { Context } from 'koa'
import log from '../utils/log'
import orgService from '../contexts/org'

const logger = log('orgs-controller')

class Orgs {
  public static async index (ctx: Context, next: Function) {
    const data = await orgService.allOrgs()
    return (ctx.body = {
      data,
    })
  }

  public static async create (ctx: Context, next: Function) {
    const { orgId, addr } = ctx.request.body
    if (!orgId || !addr) {
      return (ctx.body = {
        error: {
          code: -1,
          message: 'orgId or addr missed',
        },
      })
    }
    const result = await orgService.addOrg(orgId, addr)
    return (ctx.body = result)
  }

  public static async show (ctx: Context, next: Function) {
    const { orgId } = ctx.params
    if (!orgId) {
      return {
        error: {
          code: -1,
          message: 'orgId required',
        },
      }
    }

    const result = await orgService.getOrgAddr(orgId)
    return (ctx.body = result)
  }

  public static async update (ctx: Context, next: Function) {
    const { orgId, addr } = ctx.request.body
    if (!orgId || !addr) {
      return (ctx.body = {
        error: {
          code: -1,
          message: 'orgId or addr missed',
        },
      })
    }
    const result = await orgService.updateOrg(orgId, addr)
    return (ctx.body = result)
  }

  public static async delete (ctx: Context, next: Function) {
    const { orgId } = ctx.request.body
    if (!orgId) {
      return (ctx.body = {
        error: {
          code: -1,
          message: 'orgId is required',
        },
      })
    }

    const result = await orgService.deleteOrg(orgId)
    return (ctx.body = result)
  }
}

export default Orgs
