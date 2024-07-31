package uic.it.signature.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VerificationSignatureController {
	@GetMapping("/verification_signature")
	public String toVerifySignature() {
		return "verification_signature";
	}
}
