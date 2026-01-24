FROM python:3.12-slim

WORKDIR /app

# Install uv
RUN pip install --no-cache-dir uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen

# Copy project files
COPY . .

# Gradio
EXPOSE 7860
ENV GRADIO_SERVER_NAME="0.0.0.0"

# Run the application
CMD ["uv", "run", "app.py"]
