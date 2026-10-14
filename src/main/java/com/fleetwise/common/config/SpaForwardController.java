package com.fleetwise.common.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping({"/", "/login", "/dashboard", "/companies", "/vehicles", "/driver-entry"})
    public String forward() {
        return "forward:/index.html";
    }
}