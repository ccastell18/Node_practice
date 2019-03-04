if(process.env.NODE_ENV === 'production'){
module.exports = {
    mongoURI: 'mongodb://John:test123@ds151354.mlab.com:51354/vidjot_prod'
}
}else{
module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}