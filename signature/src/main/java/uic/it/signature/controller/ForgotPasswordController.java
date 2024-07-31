package uic.it.signature.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ForgotPasswordController {
	@GetMapping("/forgot")
	public String toForgot() {
		return "forgot";
	}

}
