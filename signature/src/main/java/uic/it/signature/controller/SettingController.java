package uic.it.signature.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SettingController {
	@GetMapping("/setting")
	public String toSetting() {
		return "setting";
	}

}
