import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const DailyFormula = () => {
  const formula = {
    title: "Rumus Phytagoras",
    latex: "$c^2 = a^2 + b^2$",
    description: "Digunakan untuk mencari sisi miring segitiga siku-siku.",
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-blue-600 mb-6">{formula.title}</h2>
      <div className="text-center mb-6 text-lg">
        <Latex>{formula.latex}</Latex>
      </div>
      <p className="text-gray-700 text-sm">{formula.description}</p>
    </div>
  );
};

export default DailyFormula;
