package uic.it.signature.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DigitalSignatureController {
	@GetMapping("/digitalsignature")
	public String toSignature() {
		return "digitalsignature";
	}

}
