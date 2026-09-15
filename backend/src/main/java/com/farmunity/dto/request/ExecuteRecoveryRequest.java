package com.farmunity.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecuteRecoveryRequest {
    @NotBlank(message = "Recovery option ID is required")
    private String optionId; // OPTION_REPLACE_FARMER, OPTION_REDUCE_QUANTITY, OPTION_RESCHEDULE
    private Long replacementListingId;
    private String reason;
}
