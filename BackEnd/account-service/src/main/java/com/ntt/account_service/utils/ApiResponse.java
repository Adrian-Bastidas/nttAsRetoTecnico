package com.ntt.account_service.utils;

public class ApiResponse<T> {

    private String status;
    private String message;
    private T data;
    private String errorCode;

    public ApiResponse(String status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(String status, String message, T data, String errorCode) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
    }

    public ApiResponse() {
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("success", "Operación exitosa", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("success", message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>("error", message, null);
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>("error", message, null, errorCode);
    }

    public static <T> ApiResponse<T> error(String message, T data, String errorCode) {
        return new ApiResponse<>("error", message, data, errorCode);
    }

    // ===== MÉTODOS VALIDACIÓN =====
    public static <T> ApiResponse<T> badRequest(String message) {
        return new ApiResponse<>("error", message, null, "BAD_REQUEST");
    }

    public static <T> ApiResponse<T> unauthorized(String message) {
        return new ApiResponse<>("error", message, null, "UNAUTHORIZED");
    }

    public static <T> ApiResponse<T> forbidden(String message) {
        return new ApiResponse<>("error", message, null, "FORBIDDEN");
    }

    public static <T> ApiResponse<T> notFound(String message) {
        return new ApiResponse<>("error", message, null, "NOT_FOUND");
    }

    public static <T> ApiResponse<T> internalServerError(String message) {
        return new ApiResponse<>("error", message, null, "INTERNAL_SERVER_ERROR");
    }

    // ===== GETTERS Y SETTERS =====
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public boolean isSuccess() {
        return "success".equals(this.status);
    }

    public boolean isError() {
        return "error".equals(this.status);
    }
}