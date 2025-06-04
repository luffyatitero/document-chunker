import React from "react";

interface ParameterFormProps {
  values: any;
  onChange: (field: string, value: any) => void;
  splitterTypes?: any[];
  lengthFunctions?: any[];
  recommendation?: any;
  onApplyRecommendation?: () => void;
}

const ParameterForm: React.FC<ParameterFormProps> = ({
  values,
  onChange,
  splitterTypes = [],
  lengthFunctions = [],
  recommendation,
  onApplyRecommendation,
}) => (
  <div>
    {recommendation && (
      <div className="mb-2 p-2 bg-green-50 border border-green-300 rounded">
        <div className="font-semibold text-green-700">Recommended for this file:</div>
        <div>Splitter: <b>{recommendation.splitter_type}</b></div>
        <div>Chunk Size: <b>{recommendation.chunk_size}</b></div>
        <div>Chunk Overlap: <b>{recommendation.chunk_overlap}</b></div>
        <div>Length Function: <b>{recommendation.length_function}</b></div>
        {recommendation.separators && (
          <div>Separators: <b>{Array.isArray(recommendation.separators) ? recommendation.separators.join(", ") : recommendation.separators}</b></div>
        )}
        <button
          className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
          onClick={onApplyRecommendation}
          type="button"
        >
          Apply Recommended
        </button>
      </div>
    )}

    <label className="block mt-2">Splitter Type</label>
    <select
      value={values.splitter_type}
      onChange={e => onChange("splitter_type", e.target.value)}
      className="w-full border rounded p-1"
    >
      <option value="">Select...</option>
      {splitterTypes.map((type: any) => (
        <option key={type.type} value={type.type}>
          {type.name}
        </option>
      ))}
    </select>

    <label className="block mt-2">Separator Type</label>
    <input
      type="text"
      value={values.separator_type}
      onChange={e => onChange("separator_type", e.target.value)}
      className="w-full border rounded p-1"
      placeholder="e.g. \\n or custom"
      required
    />

    <label className="block mt-2">Length Function</label>
    <select
      value={values.length_function}
      onChange={e => onChange("length_function", e.target.value)}
      className="w-full border rounded p-1"
    >
      <option value="">Select...</option>
      {lengthFunctions.map((fn: any) => (
        <option key={fn.type} value={fn.type}>
          {fn.name}
        </option>
      ))}
    </select>

    <label className="block mt-2">Chunk Size</label>
    <input
      type="number"
      value={values.chunk_size}
      onChange={e => onChange("chunk_size", Number(e.target.value))}
      className="w-full border rounded p-1"
    />

    <label className="block mt-2">Chunk Overlap</label>
    <input
      type="number"
      value={values.chunk_overlap}
      onChange={e => onChange("chunk_overlap", Number(e.target.value))}
      className="w-full border rounded p-1"
    />
  </div>
);

export default ParameterForm;