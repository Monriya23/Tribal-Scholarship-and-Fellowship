from typing import Dict, Any, Optional

class GradeNormalizationService:
    """
    Authoritative Grade Normalization Service.
    CRITICAL RULE: Never silently guess or assume CGPA conversions (e.g. blindly CGPA * 10).
    If no authoritative rule exists for a given grading scale, flag as REVIEW_REQUIRED.
    """
    
    # Official Conversion Standards from UGC / AICTE / Guidelines
    AUTHORITATIVE_STANDARDS = {
        "PERCENTAGE": {
            "source": "Direct Percentage from Official Marksheet",
            "scale": 100.0
        },
        "CGPA_10_AICTE": {
            "source": "AICTE Guideline Gazette (Percentage = (CGPA - 0.75) * 10)",
            "formula": lambda cgpa: (cgpa - 0.75) * 10.0,
            "min": 0.0,
            "max": 10.0
        },
        "CGPA_10_UGC": {
            "source": "UGC Choice Based Credit System (CBCS) Formula",
            "formula": lambda cgpa: cgpa * 10.0 if cgpa >= 5.5 else (cgpa - 0.75) * 10.0,
            "min": 0.0,
            "max": 10.0
        },
        "CGPA_4_US": {
            "source": "WES / International Standard 4.0 Scale Table",
            "table": {
                4.0: 95.0,
                3.7: 90.0,
                3.3: 85.0,
                3.0: 80.0,
                2.7: 75.0,
                2.3: 70.0,
                2.0: 60.0
            },
            "min": 0.0,
            "max": 4.0
        }
    }

    @classmethod
    def normalize_academic_score(
        cls,
        grade_type: str,
        grade_value: str,
        conversion_standard: str = "CGPA_10_AICTE"
    ) -> Dict[str, Any]:
        """
        Normalize score and return complete provenance of normalization.
        """
        g_type = grade_type.upper().strip()
        val_str = grade_value.strip().replace("%", "")
        
        try:
            val_num = float(val_str)
        except ValueError:
            return {
                "status": "REVIEW_REQUIRED",
                "normalized_percentage": None,
                "original_value": grade_value,
                "original_scale": grade_type,
                "normalization_method": "FAILED_TO_PARSE",
                "normalization_source": "None",
                "explanation": f"Unable to parse score '{grade_value}' as a numeric grade."
            }

        # Case 1: Direct Percentage
        if g_type in ["PERCENTAGE", "PERCENT", "MARKS"]:
            if 0.0 <= val_num <= 100.0:
                return {
                    "status": "PASS",
                    "normalized_percentage": round(val_num, 2),
                    "original_value": str(val_num),
                    "original_scale": "PERCENTAGE_100",
                    "normalization_method": "DIRECT_PERCENTAGE",
                    "normalization_source": "Official Marksheet Declared / Extracted",
                    "explanation": f"Direct percentage of {val_num}% retained without transformation."
                }
            else:
                return {
                    "status": "REVIEW_REQUIRED",
                    "normalized_percentage": None,
                    "original_value": str(val_num),
                    "original_scale": "PERCENTAGE_100",
                    "normalization_method": "INVALID_RANGE",
                    "normalization_source": "Validation Gate",
                    "explanation": f"Percentage {val_num}% out of bounds (0 - 100)."
                }

        # Case 2: 10-Point CGPA
        elif g_type in ["CGPA_10", "CGPA", "10_POINT_SCALE"]:
            if not (0.0 <= val_num <= 10.0):
                return {
                    "status": "REVIEW_REQUIRED",
                    "normalized_percentage": None,
                    "original_value": str(val_num),
                    "original_scale": "10_POINT_CGPA",
                    "normalization_method": "OUT_OF_BOUNDS",
                    "normalization_source": "Validation Gate",
                    "explanation": f"10-point CGPA {val_num} out of bounds (0.0 - 10.0)."
                }
            
            standard_info = cls.AUTHORITATIVE_STANDARDS.get(conversion_standard, cls.AUTHORITATIVE_STANDARDS["CGPA_10_AICTE"])
            calc_pct = standard_info["formula"](val_num)
            calc_pct = max(0.0, min(100.0, calc_pct))
            
            return {
                "status": "PASS",
                "normalized_percentage": round(calc_pct, 2),
                "original_value": str(val_num),
                "original_scale": "10_POINT_CGPA",
                "normalization_method": conversion_standard,
                "normalization_source": standard_info["source"],
                "explanation": f"Converted CGPA {val_num}/10.0 to {round(calc_pct, 2)}% using {standard_info['source']}."
            }

        # Case 3: 4-Point GPA (e.g. for NOS foreign admissions)
        elif g_type in ["GPA_4", "4_POINT_SCALE", "US_GPA"]:
            if not (0.0 <= val_num <= 4.0):
                return {
                    "status": "REVIEW_REQUIRED",
                    "normalized_percentage": None,
                    "original_value": str(val_num),
                    "original_scale": "4_POINT_GPA",
                    "normalization_method": "OUT_OF_BOUNDS",
                    "normalization_source": "Validation Gate",
                    "explanation": f"4-point GPA {val_num} out of bounds (0.0 - 4.0)."
                }
            
            # Interpolate table
            table = cls.AUTHORITATIVE_STANDARDS["CGPA_4_US"]["table"]
            matched_pct = 60.0
            for min_gpa, pct in sorted(table.items(), reverse=True):
                if val_num >= min_gpa:
                    matched_pct = pct
                    break

            return {
                "status": "PASS",
                "normalized_percentage": matched_pct,
                "original_value": str(val_num),
                "original_scale": "4_POINT_GPA",
                "normalization_method": "WES_EQUIVALENCY_TABLE",
                "normalization_source": cls.AUTHORITATIVE_STANDARDS["CGPA_4_US"]["source"],
                "explanation": f"Mapped 4-point GPA {val_num} to {matched_pct}% using {cls.AUTHORITATIVE_STANDARDS['CGPA_4_US']['source']}."
            }

        # Case 4: Non-Standard / Letter Grades without defined rule
        else:
            return {
                "status": "REVIEW_REQUIRED",
                "normalized_percentage": None,
                "original_value": grade_value,
                "original_scale": grade_type,
                "normalization_method": "NO_AUTHORITATIVE_CONVERSION_RULE",
                "normalization_source": "Official Policy Requirement",
                "explanation": f"Unable to determine an authoritative conversion for grading system '{grade_type}'. Manual institutional officer review required."
            }
