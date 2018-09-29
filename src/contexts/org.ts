import Sequelize from 'sequelize'
import service, { Org } from './model'
import log from '../utils/log'
import { OrgErrors } from '../enums'

const logger = log('org-context')

class OrgService {
  public static allOrgs () {
    logger.debug('Listing all orgs')
    return Org.findAll({
      attributes: ['orgId', 'addr'],
    })
      .then(data => data)
      .catch(err => ({
        error: {
          code: -1,
          message: JSON.stringify(err),
        },
      }))
  }
  /**
   * @method addOrg
   * @param id - Org ID
   * @param addr - Org Addr
   */
  public static addOrg (orgId: string, addr: string) {
    logger.debug('Creating Org')
    return service.sync().then(() => Org.create({ orgId, addr })
      .then(() => {
        logger.debug('Creating Org Success')
        return {
          data: true,
        }
      })
      .catch(err => {
        logger.error('Creating Org Failed')
        return {
          error: {
            code: -1,
            message: err.errors
              ? err.errors
                .map((dbError: { message: string }) => dbError.message)
                .join()
              : JSON.stringify(err),
          },
        }
      }))
  }

  public static updateOrg (orgId: string, addr: string) {
    logger.debug('Updating Org')
    return Org.update(
      {
        addr,
      },
      {
        where: {
          orgId,
        },
      },
    )
      .then(() => {
        logger.debug('Updating Org Success')
        return { data: true }
      })
      .catch(err => {
        const message = err.errors
          ? err.errors
            .map((dbError: { message: string }) => dbError.message)
            .join()
          : JSON.stringify(err)
      })
  }

  public static getOrgAddr (orgId: string) {
    logger.debug('Getting Org Addr')
    return Org.findOne({ where: { orgId } })
      .then((org: Sequelize.Instance<any>) => {
        if (org) {
          logger.debug('Getting Org Success')
          return {
            data: org.getDataValue('addr'),
          }
        }
        return {
          error: {
            code: -1,
            message: OrgErrors.NotFound,
          },
        }
      })
      .catch(err => ({
        error: {
          code: -1,
          message: JSON.stringify(err),
        },
      }))
  }

  public static deleteOrg (orgId: string) {
    logger.debug('Deleting Org')
    return Org.destroy({
      where: {
        orgId,
      },
    })
      .then(() => {
        logger.debug('Deleting Org Success')
        return {
          data: true,
        }
      })
      .catch(err => {
        logger.debug('Deleting Org Failed')
        return {
          error: {
            code: -1,
            message: JSON.stringify(err),
          },
        }
      })
  }
}
export default OrgService
