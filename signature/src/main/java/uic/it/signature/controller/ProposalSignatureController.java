package uic.it.signature.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProposalSignatureController {
	@GetMapping("/proposal_signature")
	public String toProposalSignature() {
		return "proposal_signature";
	}
}
