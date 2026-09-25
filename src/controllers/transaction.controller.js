const accountModel = require('../models/account.model')
const ledgerModel = require('../models/ledger.model')
const transactionModel = require('../models/transaction.model')
const emailService = require('../services/email.service')



/**
 * - Create a new transaction
 * The 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */

async function createTransaction(req, res){

    /**
     * - 1. Validate request
     */

    const {fromAccount, toAccount, amount, idempotencyKey} = req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "fromAccount, toAccount, amount, idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if( !fromAccount || ! toUserAccount){
        return res.status(400).json({
            message: "Invalid fromAccount and toAccount"
        })
    }

    /**
     * - 2. Validate idempotency key
     */

    const isTransactionExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if(isTransactionExists){
        if(isTransactionExists.status === "COMPLETED"){
            res.status(200).json({
                message: "Transaction already proceed",
                transaction: isTransactionExists
            })
        }

        if(isTransactionExists.status === "PENDING"){
            return res.status(200).json({
                message: "Transaction is still pending"
            })
        }

        if(isTransactionExists.status === "FAILED"){
            return res.status(500).json({
                message: "Transaction processing is failed, please retry"
            })
        }

        if(isTransactionExists.status === "REVERSED"){
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }

    
}

module.exports = {
    createTransaction
}