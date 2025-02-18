/**
 * @name LabelSelectOptions
 * @description 레이블 선택란
 *
 * @prop {string} className
 * @prop {string} label
 * @prop {string} id
 * @prop {string} value
 * @prop {function} onChange
 * @prop {boolean} disabled
 * @prop {Array} options
 *
 * @returns {JSX.Element} LabelSelectOptions
 */
const LabelSelectOptions = ({
  className = "",
  label,
  id,
  value,
  onChange,
  disabled,
  options,
}) => (
  <div className={`flex items-center mb-1 w-full  ${className}`}>
    <label className="flex items-center w-[60px] max-w-[100px]" htmlFor={id}>
      {label}
    </label>
    <select className="w-full min-w-30 max-w-xl"
      value={value} onChange={onChange} disabled={disabled}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default LabelSelectOptions;
