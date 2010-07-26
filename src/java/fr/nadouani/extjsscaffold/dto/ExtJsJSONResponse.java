package fr.nadouani.grails.plugins.extjsscaffold.dto;

public class ExtJsJSONResponse {
	private boolean success;

	private Object data;

	public ExtJsJSONResponse(boolean success, Object data) {
		super();
		this.success = success;
		this.data = data;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}
}
