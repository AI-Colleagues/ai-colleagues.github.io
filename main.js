// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.contains("open");
            mobileMenu.classList.toggle("open");
            mobileMenuToggle.classList.toggle("open");
            mobileMenuToggle.setAttribute("aria-expanded", !isOpen);
        });

        // Close menu when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("open");
                mobileMenuToggle.classList.remove("open");
                mobileMenuToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenu.classList.remove("open");
                mobileMenuToggle.classList.remove("open");
                mobileMenuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }
});

// Chatkit integration
window.addEventListener("DOMContentLoaded", () => {
    const workflowUrl =
        "https://orcheo.ai-colleagues.com/chat/5a573dd0-69dc-4cc9-94eb-78a1166dd4cc";
    const parsedWorkflowUrl = new URL(workflowUrl);
    const workflowId = parsedWorkflowUrl.pathname.split("/").filter(Boolean).pop();
    const backendBase = parsedWorkflowUrl.origin;
    const domainKey = "domain_pk_6954ef8b091c8190b0734f266b51edd00094f73ed7d04989";

    const chatkit = document.querySelector("openai-chatkit");
    const container = document.querySelector("[data-chatkit-container]");
    const toggleButton = document.querySelector("[data-chatkit-toggle]");
    const panel = document.querySelector("[data-chatkit-panel]");
    const closeButton = document.querySelector("[data-chatkit-close]");

    if (
        !workflowId ||
        !chatkit ||
        !container ||
        !toggleButton ||
        !panel ||
        !closeButton
    ) {
        return;
    }

    const buildPublicChatFetch = ({ workflowId, backendBase, workflowName }) => {
        const baseFetch = window.fetch.bind(window);
        const apiUrl = `${backendBase}/api/chatkit`;
        return async (input, init = {}) => {
            const requestInfo = input || apiUrl;
            const nextInit = { ...init, credentials: "include" };
            const headers = new Headers(nextInit.headers || {});
            const contentType = headers.get("Content-Type") || "";
            const isJson = contentType.includes("application/json");
            const bodyIsString = typeof nextInit.body === "string";

            const serializePayload = (serialized) => {
                if (!serialized) {
                    return JSON.stringify({
                        workflow_id: workflowId,
                        metadata: {
                            workflow_id: workflowId,
                            workflow_name: workflowName,
                        },
                    });
                }
                try {
                    const payload = JSON.parse(serialized);
                    if (payload && typeof payload === "object") {
                        payload.workflow_id ||= workflowId;
                        const metadata =
                            payload.metadata && typeof payload.metadata === "object"
                                ? { ...payload.metadata }
                                : {};
                        metadata.workflow_id = workflowId;
                        metadata.workflow_name = workflowName;
                        payload.metadata = metadata;
                    }
                    return JSON.stringify(payload);
                } catch (error) {
                    return serialized;
                }
            };

            if (isJson || bodyIsString || !nextInit.body) {
                const serialized = bodyIsString ? nextInit.body : null;
                nextInit.body = serializePayload(serialized);
                headers.set("Content-Type", "application/json");
            }

            nextInit.headers = headers;
            return baseFetch(requestInfo, nextInit);
        };
    };

    const options = {
        api: {
            url: `${backendBase}/api/chatkit`,
            domainKey,
            fetch: buildPublicChatFetch({
                workflowId,
                backendBase,
                workflowName: "Orcheo Bot",
            }),
        },
        header: { enabled: true, title: { text: "Orcheo Bot" } },
        history: { enabled: false },
        composer: { placeholder: "Ask Orcheo Bot a question..." },
    };

    const applyOptions = () => {
        if (typeof chatkit.setOptions === "function") {
            chatkit.setOptions(options);
        }
    };

    if (customElements.get("openai-chatkit")) {
        applyOptions();
    } else {
        customElements.whenDefined("openai-chatkit").then(applyOptions);
    }

    const openBubble = () => {
        panel.dataset.open = "true";
        container.dataset.state = "open";
        toggleButton.setAttribute("aria-expanded", "true");
    };

    const closeBubble = () => {
        panel.dataset.open = "false";
        container.dataset.state = "closed";
        toggleButton.setAttribute("aria-expanded", "false");
    };

    toggleButton.addEventListener("click", () => {
        const isOpen = panel.dataset.open === "true";
        if (isOpen) {
            closeBubble();
        } else {
            openBubble();
        }
    });

    closeButton.addEventListener("click", closeBubble);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeBubble();
        }
    });
});

// Contact form handling
const contactForm = document.getElementById("contact-form");
const contactError = document.getElementById("contact-error");
const contactSuccess = document.getElementById("contact-success");
const contactSubmit = document.getElementById("contact-submit");
if (contactForm && contactError && contactSuccess && contactSubmit) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        contactError.textContent = "";
        contactSuccess.textContent = "";

        if (!contactForm.checkValidity()) {
            contactError.textContent = "Please complete all required fields with a valid email.";
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const company = String(formData.get("company") ?? "").trim();
        const message = String(formData.get("message") ?? "").trim();
        const accessKey = String(formData.get("access_key") ?? "").trim();
        const subject = String(formData.get("subject") ?? "").trim();

        if (!name || !email || !message) {
            contactError.textContent = "Please complete all required fields.";
            return;
        }

        contactSubmit.disabled = true;
        contactSubmit.textContent = "Sending...";

        try {
            const payload = {
                access_key: accessKey,
                subject,
                name,
                email,
                company,
                message,
            };
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.success) {
                contactSuccess.textContent = "Thanks! Your message has been sent.";
                contactForm.reset();
            } else {
                contactError.textContent = "Sorry, something went wrong. Please try again.";
            }
        } catch (error) {
            contactError.textContent = "Network error. Please try again.";
        } finally {
            contactSubmit.disabled = false;
            contactSubmit.textContent = "Send Message";
        }
    });
}
