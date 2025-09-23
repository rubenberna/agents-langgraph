export default function Ecosystem() {
  const benefits = [
    {
      title: "LangChain",
      description:
        "Provides integrations and composable components to streamline LLM application development. Contains agent abstractions built on top of LangGraph.",
    },
    {
      title: "LangSmith",
      description:
        "Helpful for agent evals and observability. Debug poor-performing LLM app runs, evaluate agent trajectories, gain visibility in production, and improve performance over time.",
    },
    {
      title: "LangGraph Platform",
      description:
        "Deploy and scale agents effortlessly with a purpose-built deployment platform for long running, stateful workflows. Discover, reuse, configure, and share agents across teams — and iterate quickly with visual prototyping in LangGraph Studio.",
    },
  ];

  return (
    <div className="w-full px-4 mt-12">
      <h2 className="text-xl font-semibold text-white mb-6">Ecosystem</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
