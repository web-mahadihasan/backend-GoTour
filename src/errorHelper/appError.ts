
class appError extends Error {
    public statusCode: number
    public status: string
    
    constructor(message: string, statusCode: number, stack = "") {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
       
        if(stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default appError