import "./LabelInput.css";

/**
 * @name LabelInput
 * @description 레이블 입력란
 *
 * @prop {string} className
 * @prop {string} label
 * @prop {string} id
 * @prop {string} value
 * @prop {boolean} autoFocus
 * @prop {function} onChange
 * @prop {boolean} disabled
 *
 * @returns {JSX.Element} LabelInput
 */
const LabelInput = ({
  className = "",
  type = "text",
  label,
  id,
  value,
  autoFocus = false,
  onChange,
  onInvalid,
  disabled,
  required = false,
}) => {
  /**
   * @name cNameByType
   * @description {type} 값에 따라 주어지는 class 명 반환
   * 
   * @returns 
   */
  const cNameByType = () => {
    return `input-${type}`;
  }
  
  return (
    <>
      <div className={cNameByType()}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          placeholder={label}
          value={value}
          autoFocus={autoFocus}
          onChange={onChange}
          onInvalid={onInvalid}
          disabled={disabled}
          required={required}
        />
      </div>
    </>
  );
};
export default LabelInput;
