const {faker} = require('@faker-js/faker/locale/en')

new Array(3).fill(null).map(_=> (
    {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        tel: faker.phone.number()
    }
)).forEach(console.log)