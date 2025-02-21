package org.osint.server.util

import org.json.JSONObject
import org.postgresql.util.PGobject
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

@Converter(autoApply = true)
class JSONObjectToPGobjectConverter : AttributeConverter<JSONObject, PGobject> {

    override fun convertToDatabaseColumn(attribute: JSONObject?): PGobject? =
        attribute?.let {
            try {
                PGobject().apply {
                    type = "jsonb"
                    value = it.toString()
                }
            } catch (ex: Exception) {
                throw IllegalArgumentException("Could not convert JSONObject to PGobject", ex)
            }
        }

    override fun convertToEntityAttribute(dbData: PGobject?): JSONObject? =
        dbData?.value?.let { JSONObject(it) }
}