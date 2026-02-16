import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Workflow, Brain, Activity } from "lucide-react";
import { withBase } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 h-72 w-72 rounded-full bg-cyan-300/70 blur-xl dark:bg-cyan-900/60" />
        <div className="absolute top-0 -right-4 h-72 w-72 rounded-full bg-blue-300/70 blur-xl dark:bg-blue-900/60" />
        <div className="absolute bottom-8 left-32 h-72 w-72 rounded-full bg-teal-300/60 blur-xl dark:bg-teal-900/60" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              <span className="text-muted-foreground">AI Consulting & Workflow Engineering</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            Build Reliable AI Systems with{" "}
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
              AI Colleagues
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            We design and deploy production AI workflows using Orcheo, from strategy and integration to monitoring and evaluation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <a href={withBase("/contact")}>
              <Button size="lg" className="group">
                Request a Demo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <a href="https://github.com/ShaojieJiang/orcheo" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">Explore Orcheo</Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 pt-8"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-2xl font-bold md:text-3xl">
                <Workflow className="h-6 w-6 text-cyan-500" />
                <span>50+</span>
              </div>
              <p className="text-sm text-muted-foreground">Workflows Delivered</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-2xl font-bold md:text-3xl">
                <Brain className="h-6 w-6 text-blue-500" />
                <span>95%</span>
              </div>
              <p className="text-sm text-muted-foreground">Client Satisfaction</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-2xl font-bold md:text-3xl">
                <Activity className="h-6 w-6 text-teal-500" />
                <span>24/7</span>
              </div>
              <p className="text-sm text-muted-foreground">Monitoring Ready</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
