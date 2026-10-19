{{/*
Expand the name of the chart.
*/}}
{{- define "field-tm.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "field-tm.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "field-tm.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "field-tm.labels" -}}
helm.sh/chart: {{ include "field-tm.chart" . }}
{{ include "field-tm.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "field-tm.selectorLabels" -}}
app.kubernetes.io/name: {{ include "field-tm.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "field-tm.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "field-tm.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Database service name.
*/}}
{{- define "field-tm.dbServiceName" -}}
{{- printf "%s-db" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{/*
Database service DNS name inside the cluster.
*/}}
{{- define "field-tm.dbServiceHost" -}}
{{- printf "%s.%s.svc.cluster.local" (include "field-tm.dbServiceName" .) .Release.Namespace -}}
{{- end }}

{{/*
Bundled Hanko auth service name.
*/}}
{{- define "field-tm.hankoServiceName" -}}
{{- printf "%s-hanko" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{/*
Bundled Hanko auth service DNS name inside the cluster.
*/}}
{{- define "field-tm.hankoServiceHost" -}}
{{- printf "%s.%s.svc.cluster.local" (include "field-tm.hankoServiceName" .) .Release.Namespace -}}
{{- end }}

{{/*
Bundled Hanko database service name.
*/}}
{{- define "field-tm.hankoDbServiceName" -}}
{{- printf "%s-hanko-db" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{/*
Bundled Hanko database service DNS name inside the cluster.
*/}}
{{- define "field-tm.hankoDbServiceHost" -}}
{{- printf "%s.%s.svc.cluster.local" (include "field-tm.hankoDbServiceName" .) .Release.Namespace -}}
{{- end }}

{{/*
Bundled Hanko database mode: shared | dedicated | external (validated).
  shared    - a separate database on the chart's in-cluster field-tm db (db.enabled=true)
  dedicated - a separate in-cluster PostGIS deployment just for Hanko
  external  - an existing Postgres server at auth.bundled.db.host
*/}}
{{- define "field-tm.hankoDbMode" -}}
{{- $mode := .Values.auth.bundled.db.mode | default "shared" -}}
{{- if not (has $mode (list "shared" "dedicated" "external")) -}}
{{- fail (printf "auth.bundled.db.mode must be one of shared, dedicated, external (got %q)" $mode) -}}
{{- end -}}
{{- if and (eq $mode "shared") (not .Values.db.enabled) -}}
{{- fail "auth.bundled.db.mode=shared needs the in-cluster field-tm database (db.enabled=true); use mode=external to point at your external server, or mode=dedicated" -}}
{{- end -}}
{{- if not (regexMatch "^[a-zA-Z_][a-zA-Z0-9_]*$" .Values.auth.bundled.db.auth.database) -}}
{{- fail "auth.bundled.db.auth.database must be a plain identifier (letters, digits, underscore)" -}}
{{- end -}}
{{- $mode -}}
{{- end }}

{{/*
Bundled Hanko database host, user and password for the selected mode.
In shared mode Hanko connects with the main field-tm db credentials.
*/}}
{{- define "field-tm.hankoDbHost" -}}
{{- $mode := include "field-tm.hankoDbMode" . -}}
{{- if eq $mode "shared" -}}
{{- include "field-tm.dbServiceHost" . -}}
{{- else if eq $mode "dedicated" -}}
{{- include "field-tm.hankoDbServiceHost" . -}}
{{- else -}}
{{- required "auth.bundled.db.host is required when auth.bundled.db.mode=external" .Values.auth.bundled.db.host -}}
{{- end -}}
{{- end }}

{{- define "field-tm.hankoDbUser" -}}
{{- if eq (include "field-tm.hankoDbMode" .) "shared" -}}
{{- .Values.db.auth.username -}}
{{- else -}}
{{- .Values.auth.bundled.db.auth.username -}}
{{- end -}}
{{- end }}

{{- define "field-tm.hankoDbPassword" -}}
{{- if eq (include "field-tm.hankoDbMode" .) "shared" -}}
{{- .Values.db.auth.password -}}
{{- else -}}
{{- .Values.auth.bundled.db.auth.password -}}
{{- end -}}
{{- end }}

{{/*
Public URL scheme, derived from ingress TLS.
*/}}
{{- define "field-tm.publicScheme" -}}
{{- if and .Values.ingress.enabled .Values.ingress.tls.enabled -}}https{{- else -}}http{{- end -}}
{{- end }}

{{/*
Public origin field-tm is served on, e.g. https://field.example.com.
*/}}
{{- define "field-tm.publicOrigin" -}}
{{- printf "%s://%s" (include "field-tm.publicScheme" .) .Values.ingress.host -}}
{{- end }}

{{/*
Public hostname for the bundled Hanko API (defaults to login.<ingress.host>).
*/}}
{{- define "field-tm.hankoPublicHost" -}}
{{- .Values.auth.bundled.ingress.host | default (printf "login.%s" .Values.ingress.host) -}}
{{- end }}
