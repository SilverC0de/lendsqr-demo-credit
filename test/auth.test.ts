import { describe, expect, test } from '@jest/globals';
import { hashPassword, checkPassword } from '../src/helpers/auth';


describe('Check password encryption', () => {

    test('Encrypt password \'silver\'', async () => {
        const hash = await hashPassword('silver');
 
        expect(hash).toMatch(/^\$2a\$12/)
    })
    
    test('Decrypt password \'silver\'', async () => {
        const check = await checkPassword('silver', '$2a$12$lA37v7/ovmijk3CVPsPTHOXQAqnrcjiWCdCJSMSVbaoEIhkUf7YVC');

        expect(check).toBe(true)
    })

})