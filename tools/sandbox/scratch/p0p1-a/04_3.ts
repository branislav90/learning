el.setAttribute("aria-expanded", "true");   // attribute (string)
el.hidden = true;                           // property reflecting [hidden]
el.classList.toggle("open", isOpen);        // class manipulation
el.style.setProperty("--x", "12px");        // inline custom property
(el as HTMLInputElement).value = "typed";   // property (not the attribute)
