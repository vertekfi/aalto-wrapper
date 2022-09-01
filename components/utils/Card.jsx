export const Card = ({ title, children }) => {
  return (
    <div className="bg-brand-dark-blue border-brand-dark-gray border-1 rounded-sm px-6 py-8 relative w-full">
      {
        !title ? '' :
        <div className="text-white text-xl mb-4">
          {title}
        </div>
      }
      <div className="text-brand-gray">
        {children}
      </div>
    </div>
  )
}