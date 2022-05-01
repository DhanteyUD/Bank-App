import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Balance, { BalanceDocument } from "../models/balance";
import Transaction from "../models/transaction";
import getPaginationData from "../utils/pagination";

const transfer = async (req: Request, res: Response) => {
	const { senderAccount, receiverAccount, amount } = req.body;
	if (senderAccount === receiverAccount) {
		return res.status(400).json({
			error: "Invalid Transaction",
		});
	}

	try {
		const sender = (await Balance.findOne({
			accountNumber: senderAccount,
		})) as BalanceDocument;
		const receiver = await Balance.findOne({ accountNumber: receiverAccount });
		const reference = nanoid(8);

		if (!receiver) {
			return res.status(404).json({
				error: "The receiver account number does not exist",
			});
		}

		sender.amount -= parseInt(amount);
		receiver.amount += parseInt(amount);

		const transaction = new Transaction({
			...req.body,
			reference,
			senderId: req.user?._id,
			receiverId: receiver.owner,
		});

		await Promise.all([sender?.save(), receiver.save(), transaction.save()]);

		res.status(201).json({
			message: "Transfer successful",
		});
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
	}
};

const getTransactions = async (req: Request, res: Response) => {
	const page = (req.query.page as string) || "1";
	const filter = {
		$or: [{ senderId: req.user?._id }, { receiverId: req.user?._id }],
	};

	try {
		const count = await Transaction.countDocuments(filter);
		const { previous, next, skip } = getPaginationData(page, count);
		const data = await Transaction.find(filter).limit(5).skip(skip);

		res.status(200).json({
			previous,
			next,
			data,
		});
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
	}
};

const getTransactionsByRef = async (req: Request, res: Response) => {
	const filter = {
		$and: [
			{ $or: [{ senderId: req.user?._id }, { receiverId: req.user?._id }] },
			{ reference: req.params.reference },
		],
	};

	try {
		const transaction = await Transaction.findOne(filter);
		if (!transaction)
			return res.status(404).json({ message: "Transaction not found" });

		res.status(200).json(transaction);
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
	}
};

export { transfer, getTransactions, getTransactionsByRef };
