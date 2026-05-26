import {parseVersion} from '../src/version'

describe('parseVersion', () => {
  test.each([
    ['v1.2.3'],
    ['v0.0.0'],
    ['v1.2.3-rc.1'],
    ['v1.2.3+build.5'],
    ['apis/v1.2.3'],
    ['apis/v2.3.0-rc.1'],
    ['service/s3/v1.84.0'],
    ['x/exp/maps/v0.0.0']
  ])('accepts %s', input => {
    expect(parseVersion(input)).toBe(input)
  })

  test.each([
    ['garbage'],
    ['apis/garbage'],
    ['apis/v1.2.3/extra'],
    ['v1.2.3/'],
    ['apis/'],
    ['']
  ])('rejects %s', input => {
    expect(parseVersion(input)).toBeNull()
  })
})
