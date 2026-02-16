import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What kinds of AI projects do you support?",
    answer:
      "We support AI consulting, workflow automation, and custom agent development. Typical projects include internal copilots, data workflows, and customer-facing AI assistants.",
  },
  {
    question: "Do you work with our existing tools and infrastructure?",
    answer:
      "Yes. We integrate with your current stack and data systems. Orcheo workflows are designed to connect with existing APIs, databases, and team tools.",
  },
  {
    question: "How do you ensure production reliability?",
    answer:
      "We design for observability, retries, and controlled rollouts from the start. Every deployment includes runtime monitoring and evaluation checkpoints.",
  },
  {
    question: "Can we start small before a full rollout?",
    answer:
      "Yes. Most engagements begin with a scoped pilot to validate value, then expand to broader workflow coverage once metrics are confirmed.",
  },
  {
    question: "Do you provide ongoing support after deployment?",
    answer:
      "Yes. We offer post-launch support for tuning prompts, improving quality, and adding new integrations as your requirements evolve.",
  },
  {
    question: "How can we discuss a potential project?",
    answer:
      "Use the contact page to share your use case. We will review your requirements and suggest a practical first implementation step.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 space-y-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold md:text-5xl"
          >
            Frequently asked
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-300 dark:to-blue-300 bg-clip-text text-transparent">
              {" "}questions
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Answers about engagement model, deployment approach, and integration scope.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
