import Address from '../address'

var ws = '  \r \t    \n GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC \t \n            \r';
// var error = Address.getValidationError(ws);
// console.log(error)
var addr = Address.fromString(ws)
console.log(addr)
