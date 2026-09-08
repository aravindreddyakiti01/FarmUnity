package com.farmunity.dto.request;

import com.farmunity.entity.enums.OrgType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterBuyerRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Organization type is required")
    private OrgType orgType;

    private Double latitude;
    private Double longitude;
    private String address;
}
