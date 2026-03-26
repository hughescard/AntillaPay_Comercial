import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { SearchableSelect, SelectOption } from "./SearchableTable";
import { SelectCategory, CategoryGroup } from "./SelectCategory";

interface Props {
    label?: string;
    action: (value: string | number) => void;
    error?: string;
    id: string;
    placeholder?: string;
    options?: SelectOption[];      
    groupedOptions?: CategoryGroup[];
    type: string;
    value: string | number;
    tabIndex: number;
    maxLength?: number;
    rows?: number;
    // Nuevas props
    disabled?: boolean;
    disabledText?: string;
}

export const InputCustom = ({ 
    label, 
    action, 
    error, 
    id, 
    placeholder, 
    options, 
    groupedOptions, 
    type, 
    value, 
    tabIndex, 
    maxLength,
    rows = 4,
    disabled = false,
    disabledText = ''
}: Props) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

    return (
        <div className="w-full">
            {label &&
                <label htmlFor={id} className={`block text-sm font-medium text-foreground mb-1 ${disabled ? 'opacity-50' : ''}`}>
                    {label}
                </label>
            }
            
            <div className="relative">
                {/* CASE 1: SELECT NORMAL */}
                {type === 'select' && (
                    <div className={`border rounded-md ${error ? 'border-danger' : 'border-0'} ${disabledClasses}`}>
                        <SearchableSelect
                            id={id}
                            value={value}
                            onChange={disabled ? () => {} : action} // Prevenir acción si está disabled
                            options={options || []}
                            placeholder={placeholder}
                            tabIndex={disabled ? -1 : tabIndex}
                        />
                    </div>
                )}
                
                {/* CASE 2: SELECT CON CATEGORÍAS (ACORDEÓN) */}
                {type === 'selectCategory' && (
                    <div className={`border rounded-md ${error ? 'border-danger' : 'border-0'} ${disabledClasses}`}>
                        <SelectCategory
                            id={id}
                            value={value}
                            onChange={disabled ? () => {} : action}
                            groups={groupedOptions || []}
                            placeholder={placeholder}
                            tabIndex={disabled ? -1 : tabIndex}
                        />
                    </div>
                )}

                {/* CASE 3: TEXTAREA */}
                {type === 'textarea' && (
                    <textarea
                        id={id}
                        rows={rows}
                        maxLength={maxLength}
                        disabled={disabled}
                        className={`
                            w-full px-3 py-2 rounded-md border bg-background text-foreground shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all 
                            placeholder:text-muted-foreground/50 resize-y min-h-25
                            ${error ? 'border-danger' : 'border-border'}
                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        placeholder={placeholder && placeholder}
                        value={value}
                        onChange={(e) => action(e.target.value)}
                        tabIndex={disabled ? -1 : tabIndex}
                    />
                )}

                {/* CASE 4: INPUTS TEXT / PASSWORD / DATE */}
                {type !== 'select' && type !== 'selectCategory' && type !== 'textarea' && (
                    <div className={`relative ${disabled ? 'opacity-50' : ''}`}>
                        <input
                            id={id}
                            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                            maxLength={maxLength ? maxLength : undefined}
                            disabled={disabled}
                            className={`
                                w-full h-10 px-3 rounded-md border bg-background text-foreground shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all 
                                placeholder:text-muted-foreground/50
                                ${error ? 'border-danger' : 'border-border'}
                                ${disabled ? 'cursor-not-allowed' : ''}
                            `}
                            placeholder={placeholder && placeholder}
                            value={value}
                            onChange={(e) => action(e.target.value)}
                            tabIndex={disabled ? -1 : (tabIndex ? tabIndex : undefined)}
                        />
                        {type === 'password' &&
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={disabled}
                                className={`absolute inset-y-0 right-0 px-3 flex cursor-pointer items-center text-muted-foreground hover:text-foreground transition-colors ${disabled ? 'cursor-not-allowed' : ''}`}
                                tabIndex={-1}
                                aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                    </div>
                )}
            </div>

            {error && !disabled &&
                <p className="mt-1 text-sm text-danger" role="alert">
                    {error}
                </p>
            }

            {disabled && disabledText && (
                <p className="mt-1 text-sm text-muted-foreground italic" role="alert">
                    {disabledText}
                </p>
            )}
        </div>
    )
}