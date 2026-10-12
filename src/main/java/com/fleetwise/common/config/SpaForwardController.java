package com.fleetwise.common.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    /**
     * Forward non-API routes to Angular index.html (SPA support).
     */
    @GetMapping(value = {
            "/",
            "/{path:^(?!api|actuator|assets).*$}",
            "/{path:^(?!api|actuator|assets).*$}/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}