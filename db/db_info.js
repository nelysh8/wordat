module.exports = (function (){
    return{
        local : {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '#1tsom0926',
            database: 'testdb',
            multipleStatements : true
        },
        real : {
            host:'y6aj3qju8efqj0w1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            port:'3306',
            user:'kfw13xciyjo8ris6',
            password:'t8vcnh6mahh491kx',
            database: '',
            multipleStatements : true
        },
        client : {
            host:'y6aj3qju8efqj0w1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            port:'3306',
            user:'kfw13xciyjo8ris6',
            password:'t8vcnh6mahh491kx',
            database: '',
            multipleStatements : true
        },
        staging : {
            host:'',
            port:'',
            user:'',
            password:'',
            database:''
        },
        dev : {
            host:'',
            port:'',
            user:'',
            password:'',
            database:''
        }
    }
})();

// database:'oq4p2dxa5zpnk9gu',