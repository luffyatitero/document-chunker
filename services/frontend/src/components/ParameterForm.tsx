import React from "react";

interface ParameterFormProps {
  values: {
    chunkSize: number | "";
    chunkQty: number | "";
    param3?: string;
    param4?: string;
    param5?: string;
  };
  onChange: (field: string, value: any) => void;
}

const ParameterForm: React.FC<ParameterFormProps> = ({ values, onChange }) => (
  <div className="border rounded p-4 mt-4">
    <div className="font-bold mb-2">Set Parameters</div>
    <div className="mb-2 flex items-center">
      <label className="w-32">Chunk Size</label>
      <select
        className="border rounded px-2 py-1 flex-1"
        value={values.chunkSize}
        onChange={e => onChange("chunkSize", Number(e.target.value))}
      >
        <option value="">Select</option>
        {[500, 1000, 1500, 2000].map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </div>
    <div className="mb-2 flex items-center">
      <label className="w-32">Chunk Qty.</label>
      <select
        className="border rounded px-2 py-1 flex-1"
        value={values.chunkQty}
        onChange={e => onChange("chunkQty", Number(e.target.value))}
      >
        <option value="">Select</option>
        {[5, 10, 20, 50].map(qty => (
          <option key={qty} value={qty}>{qty}</option>
        ))}
      </select>
    </div>
    <div className="mb-2 flex items-center">
      <label className="w-32">Parameter 3</label>
      <select
        className="border rounded px-2 py-1 flex-1"
        value={values.param3 || ""}
        onChange={e => onChange("param3", e.target.value)}
      >
        <option value="">Select</option>
        <option value="A">A</option>
        <option value="B">B</option>
      </select>
    </div>
    <div className="mb-2 flex items-center">
      <label className="w-32">Parameter 4</label>
      <select
        className="border rounded px-2 py-1 flex-1"
        value={values.param4 || ""}
        onChange={e => onChange("param4", e.target.value)}
      >
        <option value="">Select</option>
        <option value="X">X</option>
        <option value="Y">Y</option>
      </select>
    </div>
    <div className="mb-2 flex items-center">
      <label className="w-32">Parameter 5</label>
      <select
        className="border rounded px-2 py-1 flex-1"
        value={values.param5 || ""}
        onChange={e => onChange("param5", e.target.value)}
      >
        <option value="">Select</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </div>
  </div>
);

export default ParameterForm;