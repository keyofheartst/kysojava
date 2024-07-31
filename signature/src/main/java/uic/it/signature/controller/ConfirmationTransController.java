package uic.it.signature.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ConfirmationTransController {
	@GetMapping("/confirmation")
	public String toConfirmationTrans() {
		return "confirmationTrans";
	}
}
