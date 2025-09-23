export default function BenefitsCards() {
  const benefits = [
    {
      title: "Durable execution",
      description:
        "Build agents that persist through failures and can run for extended periods, resuming from where they left off.",
    },
    {
      title: "Human-in-the-loop",
      description:
        "Incorporate human oversight by inspecting and modifying agent state at any point.",
    },
    {
      title: "Comprehensive memory",
      description:
        "Create stateful agents with both short-term working memory for ongoing reasoning and long-term memory across sessions.",
    },
    {
      title: "Debugging with LangSmith",
      description:
        "Gain deep visibility into complex agent behavior with visualization tools that trace execution paths, capture state transitions, and provide detailed runtime metrics.",
    },
    {
      title: "Production-ready deployment",
      description:
        "Deploy sophisticated agent systems confidently with scalable infrastructure designed to handle the unique challenges of stateful, long-running workflows",
    },
  ];

  return (
    <div className="w-full px-4 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors duration-200"
          >
            <h3 className="text-lg font-semibold text-white mb-3">
              {benefit.title}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
