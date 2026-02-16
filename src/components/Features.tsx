import { motion } from "framer-motion";
import {
  Workflow,
  Database,
  Bot,
  Cable,
  Radar,
  SlidersHorizontal,
} from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "Workflow Design",
    description:
      "Build and evolve multi-step AI workflows with clear state transitions and reusable node patterns.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Bot,
    title: "Agent Development",
    description:
      "Design tool-using agents with deterministic controls for retries, memory, and execution limits.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Database,
    title: "Data Integration",
    description:
      "Connect to operational systems and databases so workflows can act on business data safely.",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Cable,
    title: "Platform Integrations",
    description:
      "Integrate OpenAI, Slack, Telegram, MongoDB, and custom tools through extensible adapters.",
    gradient: "from-sky-500 to-blue-500",
  },
  {
    icon: Radar,
    title: "Observability",
    description:
      "Track execution status, latency, and runtime events with production-oriented monitoring hooks.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: SlidersHorizontal,
    title: "Evaluation and Control",
    description:
      "Measure quality, compare prompt or tool changes, and enforce guardrails before full rollout.",
    gradient: "from-cyan-500 to-emerald-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Orcheo Services for
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-300 dark:to-blue-300 bg-clip-text text-transparent">
              {" "}Production AI
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            From architecture to deployment, we help teams ship AI systems that are reliable, observable, and measurable.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br p-3 ${feature.gradient}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
