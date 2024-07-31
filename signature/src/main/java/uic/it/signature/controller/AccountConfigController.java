package uic.it.signature.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AccountConfigController {
	@GetMapping("/account_config")
	public String toTransactionLog() {
		return "account_config";
	}

}
