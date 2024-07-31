package uic.it.signature.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TransactionHistoryController {
	@GetMapping("/transaction")
	public String toTransactionLog() {
		return "transactionlog";
	}

}
