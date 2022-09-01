import { Card } from "./utils/Card";

export const Faq = () => {
  return (
    <div className="mx-2 sm:mx-0">
      <div className="grid grid-flow-row gap-4 mb-8">
        <h2 className="text-2xl text-white">FAQ</h2>
        <Card title="Why wrap AALTO?" footer="A-Team Index Link">
          <p>
            The wrapped version of Aalto allows it to be a lot more compatible with various systems than a vanilla rebase token. wAALTO tracks the value of Aalto within itself including rebases, and adjusts it&abpos;s own price accordingly.
          </p>
          <div className="text-brand-gray underline mt-4">
            <a 
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              A-Team Index Link
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Faq;